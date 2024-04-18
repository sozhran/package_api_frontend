import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/globals";
import Link from "next/link";

export interface Dependency {
    name: string;
    version: string;
    link: string;
}

export default function PackagePage() {
    const [data, setData] = useState<[any] | null>(null);

    const router = useRouter();
    const idFromUrl = router.query.id;

    useEffect(() => {
        const fetchData = async () => {
            if (idFromUrl === undefined) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/package/${idFromUrl}`, { method: "GET" });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    setData(jsonResponse);
                } else return;
            } catch (error) {
                console.error(error);
                return;
            }
        };

        fetchData();
    }, [idFromUrl]);

    return (
        <>
            {data !== null ? (
                data.map((elm, index) => (
                    <div key={index}>
                        <li>
                            <b>Name:</b> {elm.package}
                        </li>
                        <li>
                            <b>Dependencies:</b>
                            {elm.depends
                                ? elm.depends.map((dep: Dependency, index: number) => (
                                      <p key={index}>
                                          {dep.link ? <Link href={dep.link}>{dep.name}</Link> : <p>{dep.name}</p>}
                                      </p>
                                  ))
                                : "None"}
                        </li>
                        <li>
                            <b>Reverse dependencies:</b>{" "}
                            {elm.reverse
                                ? elm.reverse.map((x: string, index: number) => (
                                      <p key={index}>
                                          <Link href={`/package/${x}`}>{x}</Link>
                                      </p>
                                  ))
                                : "None"}
                        </li>
                        <li>
                            <b>Description:</b> {elm.description}
                        </li>
                        <br />
                        <Link href="/">
                            <button>Back to Home</button>
                        </Link>
                    </div>
                ))
            ) : (
                <p>loading...</p>
            )}
        </>
    );
}
