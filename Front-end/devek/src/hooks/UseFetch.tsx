import { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/UserContext";

export const API_HOST = 'http://localhost:8000';
export const SSE_HOST = 'http://localhost:8004';
export const SCRAPE_HOST = 'http://localhost:8002';

export interface FetchRequest {
    triggerRequest: boolean;
    setTriggerRequest: (value: boolean) => void;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
    headers: Record<string, string>;
    endpoint: string;
    payload?: unknown;
    callback: (data: any) => void;
}

export const useFetch = (request: FetchRequest) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {logOut, user} = useAuth();


    useEffect(() => {
        let ignore = false;
        if (request.triggerRequest) {
            // console.log('useFetchContentAPI', request.endpoint);
            setIsLoading(true);

            const req: RequestInit = {
                method: request.method,
                headers: request.headers,
            };

            if (request.method === 'POST' || request.method === 'PUT') {
                req.body = JSON.stringify(request.payload);
            }

            fetch(request.endpoint, req)
                .then(response => {

                    if (response.status === 401) {
                        console.warn("Unauthorized request. Redirecting to login...");

                        if (user !== null) {
                            logOut();
                        }

                        throw new Error("Unauthorized request. Redirecting to login...");
                    }


                    if (!response.ok) {
                        // error coming back from server
                        throw new Error(`Content API error: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (!ignore) {
                        request.callback(data);
                        setError(null);
                        setIsLoading(false);
                    }
                })
                .catch((err: Error) => {
                    setError(err.message);
                    setIsLoading(false);
                    console.error(err);
                });
        }

        return () => {
            ignore = true;
        };
    }, [request]);

    return [error, isLoading] as const;
};
