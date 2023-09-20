# Node.js Express User Authentication with MongoDB, Encryption, and Session Management

This project demonstrates how to build a user authentication system using Node.js, Express, MongoDB, and session management. The focus is on security best practices, such as encrypting passwords and using secure sessions. The project also includes detailed explanations and step-by-step instructions to help junior developers understand the code.

## Step 1: Setup

Start by installing the required dependencies:

```
npm install express body-parser mongoose crypto dotenv express-session
```
or
```
npm install 
```

Create a `.env` file and add your MongoDB connection string and a secret key for encryption:

- The `DB_URL` must be a valid url which can be located in your Mongodb Atlas dashboard

- The `CRYPTO_KEY` can be any string with a size of 32 bytes (32 characters)

- The `SESSION_SECRET` can be any string of any length
```
DB_URL=mongodb://localhost:27017/user-auth
CRYPTO_KEY=your-secret-key-here
SESSION_SECRET=your-session-secret-here
```

## Step 2: Database Models

Ensure you have a collection in your mongodb database that for use with the User schema in `models/user.js`:

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: String
});

// Ensure you have a collection with a users document
module.exports = mongoose.model("User", userSchema);
```

## Step 3: Encryption and Decryption

Use the  `crypto.js` file for encrypting and decrypting passwords:

```javascript
// Provide your own secretKey in the .env file
const algorithm = "aes-256-cbc";
const secretKey = process.env.CRYPTO_KEY; 

/**
 * Encrypts a string using the secret key stored in the env file (32 bytes max length)
 * @param {string} string Plain string to be encrypted
 * @returns Encrypted string
 */
function encryptString (string)

/**
 * Decrypts a string using the secret key stored in the env file (32 bytes max length)
 * @param {string} string Encrypted string to be decrypted 
 * @returns Decrypted string
 */
function decryptString (string)

/**
 * Compares a decrypted string to an encrypted string
 * @param {string} encryptedString An encrypted to compare to
 * @param {string} decryptedString A decrypted string to compare to the encrypted string
 * @return Strings match
 */
function compare (encryptedString, decryptedString)
```
## Step 4: Styling with Tailwind

The project uses [Tailwind CSS](https://tailwindcss.com/) as its styling framework.

1. Install tailwindcss into the project directory by running this command from terminal or cmd prompt:
```sh
npm install -D tailwindcss
```

2. Initialize tailwindcss by running this command frm the terminal or cmd prompt:
```sh
npx init tailwindcss
```

3. This will create a file inside of our root folder called `tailwind.config`. We need this config files so that we can configure and use tailwind's utility classes. A basic configuration setup includes adding the content paths to the `content` array and defining the `darkMode` type. To find more information and to further configure your tailwind setup, view the [docs](https://tailwindcss.com/docs/installation) here.
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "media",
    content: ["./views/*.ejs", "./views/**/*.ejs"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

4. After creating and configuring the `tailwind.config.js` file, we need to create a `public/config.css` file. Inside this file you need to include the proper utility classes that you will be using. The following config can be used for most projects.
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Once we have imported the utility classes the final step is to run the compiler. You can do this one of two ways. One time to compile your current code into the output file, or run it in the background to compile every time a change is made.
Single build:
```sh
npx tailwindcss -i ./src/input.css -o ./dist/output.css
or
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

### Removing Tailwind

Tailwind is included as part of this project but can easily be removed if desired by removing it from the package.json dependencies section or comment out. If tailwind is removed, custom stylesheets will need to be create to design the page

```sh
npm remove tailwindcss
```