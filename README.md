Universal Media Downloader
This guide provides step-by-step instructions on how to deploy the Universal Media Downloader web application using Visual Studio Code, GitHub, and the Vercel web interface. No command line is needed.

Part 1: Setting Up Your Project in VS Code
First, we will create all the necessary files and folders for the project on your local computer.

Create a Project Folder: Create a new folder on your computer and name it universal-media-downloader.

Open in VS Code: Open the universal-media-downloader folder in Visual Studio Code.

Create package.json: In the VS Code file explorer, click the "New File" icon and create a file named package.json. Copy the code provided for package.json and paste it into this new file.

Create index.html: Create another new file named index.html. Copy and paste the HTML content into it.

Create the api Folder: Click the "New Folder" icon and create a folder named api.

Create getMedia.js:

Make sure the api folder is selected.

Create a new file inside the api folder named getMedia.js.

Copy and paste the code for the media fetching API into this file.

Create proxy.js:

Inside the api folder, create another file named proxy.js.

Copy and paste the code for the CORS proxy into this file.

At this point, your file structure in VS Code should look exactly like this:

universal-media-downloader/
├── api/
│   ├── getMedia.js
│   └── proxy.js
├── package.json
└── index.html

Part 2: Uploading Your Project to GitHub
Next, we will upload your project to a new GitHub repository using the VS Code interface.

Sign in to GitHub: Go to GitHub.com and sign in.

Create a New Repository:

Click the + icon in the top-right corner and select New repository.

Give it a name, like universal-media-downloader.

Make sure it is set to Public.

Do not check any boxes to add a README, .gitignore, or license.

Click Create repository.

On the next page, copy the repository URL (it will look like https://github.com/YourUsername/universal-media-downloader.git).

Publish from VS Code:

Go back to VS Code. Click on the Source Control icon on the left-side activity bar (it looks like three dots connected by lines).

You will see your five files listed under "Changes".

Click the Publish Branch button.

A prompt will appear. Choose the option Publish to GitHub public repository.

VS Code will then automatically commit your files and push them to the GitHub repository you just created. You may need to sign into GitHub through VS Code if you haven't before.

Your code is now on GitHub!

Part 3: Deploying with Vercel
Finally, we will connect your GitHub repository to Vercel to deploy your application to the web.

Sign up/Log in to Vercel: Go to Vercel.com and create an account or log in. It's easiest to sign up with your GitHub account.

Import Your Project:

On your Vercel dashboard, click the Add New... button and select Project.

In the "Import Git Repository" section, you should see your universal-media-downloader repository. Click the Import button next to it.

Configure the Project:

Vercel will automatically detect that you are using Node.js.

You do not need to change any settings. The default configuration is correct.

Deploy:

Click the Deploy button.

Vercel will now start building and deploying your application. This may take a minute or two. You can watch the progress in the build logs.

Done!

Once the deployment is complete, you will see a "Congratulations!" message with a screenshot of your live website.

Click the screenshot or the "Visit" button to open your live Universal Media Downloader application in your browser.