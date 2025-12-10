import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { SendHorizontal } from "lucide-react";

export function ChatInput({value,handleValueChange}){
    return(<>
    <div className="w-full max-w-(--breakpoint-md) flex flex-row gap-2">
        <Input 
        id="mensagem"
        value={value}
        onChange={handleValueChange}
        placeholder="Digite sua mensagem..."/>
        <Button>
        Enviar
        <SendHorizontal />
        </Button>
    </div>
    
    </>)
}