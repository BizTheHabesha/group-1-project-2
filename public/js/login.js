const loginBtn = $('#loginBtn')
const signUpBtn = $('#signUpBtn')

$('#signUpBtn').submit( async (e) => {
    e.preventDefault();

    const email = $('#register-email').val().trim();
    const password = $('#register-password').val().trim();
    const phoneNumber = $('#register-phone').val().trim();
    
    const signUp = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            phone,
        })
    });

    if (signUp.ok) {
        document.location.replace('/');
    } else {
        const errorData = await signUp.json();
    }
});

// Login Button

$('#loginBtn').submit( async (e) => {
    e.preventDefault();

    const email = $('#login-email').val().trim();
    const password = $('#login-password').val().trim();

    const logIn = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password
        })
    });

    if (logIn.ok) {
        document.location.replace('/');
    } else {
        const errorData = await logIn.json();
    }
});
