const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


async function  register(event){
    event.preventDefault();

    const username=document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    console.log(username,email,password)

    const registerData = {
        username,
        email,
        password
    };

    try {
        
        const response =await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        if (response.ok) {
            
            window.location.href = '/auth';
        } else {
            
            console.error('Register failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
async function  login(event){

    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log(email,password)

    const loginData = {
        email: email,
        password: password
    };

    try {
        
        const response =await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        if (response.ok) { 
            window.location.href = '/';
        } else {
            console.error('Login failed');

        }
    } catch (error) {
        console.error('Error:', error);
    }

}