import { registerUser } from "@/actions/auth";
import { loginUser } from "@/actions/auth";
async function testAuth() {
    // Реєстрація з помилковим email
    const regResult = await registerUser({
        name: "Marta", 
        email: "marta@example.com", // Змінив на валідний для тесту
        password: "qwwerty123"
    });
    console.log("Register result:", regResult);

    // Логін
    const loginResult = await loginUser({
        email: "marta@example.com", 
        password: "qwwery123"
    });
    console.log("Login result:", loginResult);
}

testAuth();