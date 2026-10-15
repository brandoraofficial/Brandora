// BRANDORA ADMIN LOGIN
(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyBN4ht6ktmWlLm_QwpJp4-K_9Ghwmlye8c",
        authDomain: "brandora-82748.firebaseapp.com",
        databaseURL: "https://brandora-82748-default-rtdb.firebaseio.com",
        projectId: "brandora-82748",
        storageBucket: "brandora-82748.firebasestorage.app",
        messagingSenderId: "535562047751",
        appId: "1:535562047751:web:ff03cc5dd490103b1f75a2"
    };

    const ADMIN_UID = "am1NnnYjHMUZeTvABEYaICr6mQ13";

    function startAdminLogin() {
        if (!window.firebase) {
            alert("Firebase load nahi hua. Internet check karo.");
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        const auth = firebase.auth();
        const adminSection = document.getElementById("adminSection");

        if (!adminSection) {
            console.error("Admin section nahi mila.");
            return;
        }

        if (document.getElementById("brandoraLogin")) {
            return;
        }

        const box = document.createElement("section");
        box.id = "brandoraLogin";

        box.style.cssText = `
            max-width:420px;
            margin:35px auto;
            padding:24px;
            background:white;
            border:1px solid #ddd;
            border-radius:12px;
            color:#222;
            font-family:Arial,sans-serif;
        `;

        box.innerHTML = `
            <h2>BRANDORA Admin Login</h2>
            <p>Admin panel kholne ke liye login karo.</p>

            <form id="brandoraLoginForm">
                <input
                    id="brandoraEmail"
                    type="email"
                    placeholder="Admin email"
                    autocomplete="username"
                    required
                    style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0"
                >

                <input
                    id="brandoraPassword"
                    type="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    required
                    style="box-sizing:border-box;width:100%;padding:12px;margin:8px 0"
                >

                <button
                    type="submit"
                    style="padding:12px 20px;cursor:pointer"
                >
                    Login
                </button>
            </form>

            <p id="brandoraMessage" role="status"></p>

            <button id="brandoraLogout" type="button" hidden>
                Logout
            </button>
        `;

        adminSection.parentNode.insertBefore(box, adminSection);

        adminSection.style.setProperty(
            "display",
            "none",
            "important"
        );

        const form = document.getElementById("brandoraLoginForm");
        const message = document.getElementById("brandoraMessage");
        const logout = document.getElementById("brandoraLogout");

        auth.onAuthStateChanged(function (user) {
            if (user && user.uid === ADMIN_UID) {
                adminSection.style.setProperty(
                    "display",
                    "block",
                    "important"
                );

                form.hidden = true;
                message.textContent = "Admin login successful!";
                logout.hidden = false;
            } else {
                adminSection.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

                form.hidden = false;
                logout.hidden = true;

                if (user) {
                    message.textContent =
                        "Is account ko admin panel ki permission nahi hai.";

                    auth.signOut();
                } else {
                    message.textContent = "";
                }
            }
        });

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            message.textContent = "Login ho raha hai...";

            const email =
                document.getElementById("brandoraEmail").value.trim();

            const password =
                document.getElementById("brandoraPassword").value;

            try {
                const result = await auth.signInWithEmailAndPassword(
                    email,
                    password
                );

                if (result.user.uid !== ADMIN_UID) {
                    await auth.signOut();

                    message.textContent =
                        "Yeh account admin nahi hai. Sahi admin account se login karo.";

                    return;
                }

                form.reset();
            } catch (error) {
                console.error("Admin login error:", error);

                message.textContent =
                    "Login nahi hua. Email, password aur Firebase Authentication settings check karo.";
            }
        });

        logout.addEventListener("click", async function () {
            try {
                await auth.signOut();
            } catch (error) {
                console.error(error);

                message.textContent =
                    "Logout nahi ho saka. Dobara try karo.";
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            startAdminLogin
        );
    } else {
        startAdminLogin();
    }
})();
