import { useRouter } from "next/navigation";

const App = () => {
    const router = useRouter();
    router.push("/auth/login");
}

export default App; 