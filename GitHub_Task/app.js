const fs = require("fs");

async function getData(path) {
  try {
    const response = await fetch(path);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Fetch failed:", err.message);
    throw err;
  }
}

async function main() {
  try {
    // Get username from command line arguments
    const userName = process.argv[2];
    
    if (!userName) {
      console.log("Please provide a username");
      console.log("Usage: node app.js <github-username>");
      process.exit(1);
    }

    console.log(`\n Fetching repositories for ${userName}...`);

    // Fetch data from GitHub API (note: https://)
    const data = await getData(`https://api.github.com/users/${userName}/repos`);

    if (!data || data.length === 0) {
      console.log(" This user has no public repositories");
      return;
    }

    console.log(`Found ${data.length} repositories\n`);

    // Create repos directory if it doesn't exist (synchronous to avoid race condition)
    if (!fs.existsSync("repos")) {
      fs.mkdirSync("repos");
      console.log(" Created 'repos' directory");
    }

    // Format repository names (one per line)
    const repoNames = data.map(ele => ele.name).join('\n');

    // Write to file
    fs.writeFileSync(`./repos/${userName}.txt`, repoNames);
    
    console.log(` Successfully saved repositories to ./repos/${userName}.txt`);

  } catch (err) {
    console.log(" Error:", err.message);
    process.exit(1);
  }
}
main()
// Run the application