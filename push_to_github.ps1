# Initialize new Git repository
git init

# Add all files (respecting the .gitignore I created for you)
git add .

# Create the first commit
git commit -m "Initial commit: Complete SmartBudget app"

# Rename the default branch to main
git branch -M main

# Connect to your GitHub repository
git remote add origin https://github.com/gayathri-35ad/BudgetTracker.git

# Push the code
git push -u origin main
