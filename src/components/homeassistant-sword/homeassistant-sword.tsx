import { FC, useEffect } from "react";

interface HomeAssistantSwordProps {
    swordIsGlowing: boolean;
}

export const HomeAssistantSword : FC<HomeAssistantSwordProps> = ({swordIsGlowing}) => {
    const xhr = new XMLHttpRequest();

    useEffect(() => {
        if (swordIsGlowing) {
            xhr.open('POST', 'http://192.168.1.140:8123/api/webhook/sword_on');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
        }
        else{
            xhr.open('POST', 'http://192.168.1.140:8123/api/webhook/sword_off');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
        }
    }, [swordIsGlowing]);

    return (<div>
        {swordIsGlowing}
    </div>)
};