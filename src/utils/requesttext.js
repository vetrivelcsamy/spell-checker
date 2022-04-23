import endpoints from "./endpoints";

export const RequestText = async (content) => {
    const res = await fetch(`${endpoints}&text=${content}`);
    const json = await res.json();
    return json.response;
}