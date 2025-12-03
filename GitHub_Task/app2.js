const readline = require('readline');
const https = require('https');
const fs = require('fs');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to fetch repositories from GitHub API
function fetchGitHubRepos(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}/repos`,
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js CLI App'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      // Collect data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Process complete response
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const repos = JSON.parse(data);
            resolve(repos);
          } catch (error) {
            reject(new Error('Failed to parse JSON response'));
          }
        } else if (res.statusCode === 404) {
          reject(new Error('User not found'));
        } else {
          reject(new Error(`GitHub API returned status code: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    req.end();
  });
}

// Function to save repository names to file
function saveReposToFile(username, repos) {
  const filename = `${username}.txt`;
  
  // Extract repository names
  const repoNames = repos.map(repo => repo.name).join('\n');

  // Write to file
  fs.writeFile(filename, repoNames, (err) => {
    if (err) {
      console.error('❌ Error writing to file:', err.message);
      return;
    }
    console.log(`✅ Successfully saved ${repos.length} repositories to ${filename}`);
  });
}

// Main function
function main() {
  console.log('🔍 GitHub Repository Fetcher\n');
  
  rl.question('Enter GitHub username: ', async (username) => {
    if (!username.trim()) {
      console.error('❌ Username cannot be empty');
      rl.close();
      return;
    }

    console.log(`\n⏳ Fetching repositories for ${username}...`);

    try {
      const repos = await fetchGitHubRepos(username);
      
      if (repos.length === 0) {
        console.log('⚠️  This user has no public repositories');
        rl.close();
        return;
      }

      console.log(`📦 Found ${repos.length} repositories\n`);
      saveReposToFile(username, repos);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      rl.close();
    }
  });
}

// Run the application
main();