import { API_URL } from "@/globals";
import Link from "next/link";
import { useState, useEffect } from "react";

// Simple FE done in React because I can do it faster right now. No styling. No careful typing.

export default function Home() {
    const [data, setData] = useState<[] | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${API_URL}/list`, {
                    method: "GET",
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setData(jsonResponse);
                } else return;
            } catch (error) {
                console.error(error);
                return;
            }
        };

        fetchPackages();
    }, []);

    return (
        <div>
            <h1>Welcome to the Package API</h1>
            {data ? (
                data.map((elm, index) => (
                    <div key={index}>
                        <Link href={`/package/${elm}`}>{elm}</Link>
                    </div>
                ))
            ) : (
                <p>loading...</p>
            )}
        </div>
    );
}
