# SureFoot
<div align="center">
  <a align="center" href="https://github.com/MDoswell/1800_202310_BBY-12">
    <img src="https://github.com/MDoswell/1800_202310_BBY-12/blob/main/images/surefoot_logo.png" alt="Logo" width="250" height="200">
  </a>
</div>

## 1. Project Description
SureFoot is a web application to help walkers (dog-walkers, stroller users, etc.) browse and contribute user-submitted information about changes in sidewalk and path hazards due to weather.

## 2. Names of Contributors
List team members and/or short bio's here... 
* Hi my name is Yongeun [jenkwon92](https://github.com/jenkwon92). I'm excited about this project because it's good practical experience.
* Hi my name is Mike [MDoswell](https://github.com/MDoswell). I'm excited about this project because of the chance for practical experience.
* Hi my name is Noah [mrnoah99](https://github.com/mrnoah99). I'm excited about this project because it will help me learn how collaborating in projects works online, and how to program apps or games.
	
## 3. Technologies and Resources Used
Technologies & API's
* <img src="https://img.shields.io/badge/HTML5-v5-E34F26?logo=HTML5">
* <img src="https://img.shields.io/badge/CSS3-v3-1572B6?logo=CSS3">
* <img src="https://img.shields.io/badge/javascript-ES6+-F7DF1E?logo=javascript">
* <img src="https://img.shields.io/badge/Bootstrap-v5.0-7952B3?logo=Bootstrap">  (Frontend library)
* <img src="https://img.shields.io/badge/firebase-v8.0-23039BE5?logo=firebase"> (BAAS - Backend as a Service)
* <img src="https://img.shields.io/badge/Google%20Maps%20API-4285F4?logo=Google%20Maps%20API">
* <img src="https://img.shields.io/badge/-git-black?&logo=git">
* <img src="https://img.shields.io/badge/-github-black?&logo=github"> 

Planning
* <img src="https://img.shields.io/badge/Trello-0052CC?logo=Trello">
* <img src="https://img.shields.io/badge/Figma-F24E1E?logo=Figma">


## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Access to https://comp1800-bby12.web.app/
* A responsive web application that supports all screen sizes.
<img width="524" alt="Screenshot_10" src="https://user-images.githubusercontent.com/70299766/230571811-62e90a3e-cb84-490b-b771-f46df2ed51d5.png">

* Click the sign-up button to create a new account, or log in if having an account.

## 5. Known Bugs and Limitations
Here are some known bugs:
* The load more function on the leaderboards page is not functioning normally.
* In some cases, geolocation is not functioning properly and the exact location may not be displayed.

## 6. Features for Future
What we'd like to build in the future:
* Complete a route planning function.
* Switch the refresh function on the leaderboards page to automatic refresh function.
* Alarm function for nearest hazard
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── add_hazard.html          # Add a hazard page
├── community-create.html    # create a community page
├── community-details.html   # Community detail page
├── community.html           # Community board page
├── index.html               # landing HTML file, this is what users see when you come to url
├── leader_board.html        # Leader board page
├── login.html               # login page
├── main.html                # Main page with description of SureFoot
├── profile.html             # Profile setting page 
├── route_planning.html      # Rouote planning page
└── README.md                

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /favicon.ico                # Designed by Mike
    /feature_heat.svg           # Extracted from figma
    /feature_puddle.svg         # Extracted from figma
    /feature_tree_branch.svg    # Extracted from figma
    /feature_warning.svg        # Extracted from figma
    /feature_ice.svg            # Extracted from figma
    /footer_add_hazard.svg      # Extracted from figma
    /footer_community.svg       # Extracted from figma
    /footer_leader_board.svg    # Extracted from figma
    /footer_route_planning.svg  # Extracted from figma
    /main.svg                   # Extracted from figma
    /profile.jpg                
    /sample_hazard.jpg          # Acknowledge source
    /surefoot_logo.png          # Designed by Mike
├── scripts                  # Folder for scripts
    /addHazard.js               # Function to add a hazard 
    /authentication.js          # User login function
    /community_create.js        # Function to create a community 
    /community_details.js       # Display a detail of community 
    /community.js               # Display communities
    /firebaseAPI_BBY12.js       # API for Firebase
    /googleAPI.js               # API for Google Maps
    /leaderboards.js            # Display leaderboards
    /levels.js                  # Function to calculate help ratio
    /loginSkeleton.js           # Login skeleton
    /main.js                    # Function to add marker to Google map which invoked from database
    /pfp.js                     # Function to invoke a porfile picture
    /profile.js                 # Function to update profile settings
    /script.js                  # Sign in and loginout 
    /showHazard.js              # Function to show hazard layer popup
    /skeleton.js                # Loads navbar and logout function
├── styles                   # Folder for styles
    /style.css                  # style
├── text                     # Folder for style
    /footer.html                # Footer navigation
    /hazard.html                # Hazard layer popup 
    /loginNav.html              # Navigation after logging in
    /nav.html                   # Navigation before logging in


