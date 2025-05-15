const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to read and replace content in a file
function replaceInFile(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is in node_modules or .git
    if (filePath.includes('node_modules') || filePath.includes('.git')) {
      return;
    }
    
    // Replace occurrences of 'temu' with 'sisloguin'
    // Using case-insensitive regex to catch all variations (temu, Temu, TEMU)
    const newContent = content.replace(/temu/gi, function(match) {
      // Preserve case of original match
      if (match === match.toUpperCase()) return 'SISLOGUIN';
      if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) return 'Sisloguin';
      return 'sisloguin';
    });
    
    // Write the file if changes were made
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Function to walk directory recursively
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules and .git directories
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.vite') {
      return;
    }
    
    if (stat.isDirectory()) {
      walkDir(filePath); // Recurse into subdirectories
    } else {
      // Process files with extensions we're interested in
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md', '.svg'].includes(ext)) {
        replaceInFile(filePath);
      }
    }
  });
}

// Start processing from the current directory
console.log('Starting to update project name from "temu" to "sisloguin"...');
walkDir('.');
console.log('Project name update complete!'); 