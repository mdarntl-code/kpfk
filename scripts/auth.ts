import { registerUser } from "@/actions/auth";
import { loginUser } from "@/actions/auth";
async function testAuth() {
    const regForm = new FormData();
    regForm.append("name", "Marta");
    regForm.append("email", "marta@example.com");
    regForm.append("password", "qwwerty123");
    const regResult = await registerUser(regForm);
    console.log("Register result:", regResult);

    const logForm = new FormData();
    logForm.append("email", "marta@example.com");
    logForm.append("password", "qwwerty123");
    const loginResult = await loginUser(logForm);
    console.log("Login result:", loginResult);
}

testAuth();