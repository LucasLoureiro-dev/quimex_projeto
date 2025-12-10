import { CircleUserRound } from "lucide-react";

export function ChatMessage(){
    return(<>
    <div className="flex flex-row justify-start gap-2 bg-muted">
        <CircleUserRound />
        <div className="flex w-full flex-col gap-2">
            <div className="conteudo-mensagem p-0">
                <p>I can help with a variety of tasks: - Answering questions -
            Providing information - Assisting with coding - Generating creative
            content What would you like help with today?</p>
            </div>
        </div>
    </div>
    
    </>)
}