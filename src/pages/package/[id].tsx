import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/globals";
import Link from "next/link";

export interface Dependency {
    Name: string;
    Version: string;
    Needs_Link: string;
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
                            <b>Name:</b> {elm.Package}
                        </li>
                        <li>
                            <b>Dependencies:\n</b>
                            {elm.Depends
                                ? elm.Depends.map((dep: Dependency) => {
                                      {
                                          dep.Needs_Link ? (
                                              <p>
                                                  <Link href={`/package/${dep.Name}`}>{dep.Name}</Link>
                                              </p>
                                          ) : (
                                              <p>{dep.Name}</p>
                                          );
                                      }
                                  })
                                : "None"}
                        </li>
                        <li>
                            <b>Reverse dependencies:\n</b>{" "}
                            {elm.Reverse ? (
                                <p>
                                    <Link href={`/package/${elm.Reverse}`}>{elm.Reverse}</Link>
                                </p>
                            ) : (
                                "None"
                            )}
                        </li>
                        <li>
                            <b>Description:</b> {elm.Description}
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
