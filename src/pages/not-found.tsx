import { Layouts } from "src/components";

export function NotFound() {
    return (
        <Layouts>
            <div className="h-full grid place-content-center">
                <h1 className="text-4xl font-bold text-center">404</h1>
                <p className="text-center text-xl">Not Found!</p>
            </div>
        </Layouts>
    );
}
