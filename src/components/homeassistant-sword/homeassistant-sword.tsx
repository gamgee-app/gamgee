import { FC, useEffect } from "react";

interface HomeAssistantSwordProps {
    swordIsGlowing: boolean;
}

export const HomeAssistantSword : FC<HomeAssistantSwordProps> = ({swordIsGlowing}) => {
    const xhr = new XMLHttpRequest();

    useEffect(() => {
        if (swordIsGlowing) {
            xhr.open('POST', '192.168.1.140:8123/api/webhook/sword_on');
        }
        else{
            xhr.open('POST', '192.168.1.140:8123/api/webhook/sword_off');
        }
    }, [swordIsGlowing]);

    return (<div>
        {swordIsGlowing}
    </div>)
};