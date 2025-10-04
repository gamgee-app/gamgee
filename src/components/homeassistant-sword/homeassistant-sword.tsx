import { FC, useEffect } from "react";

interface HomeAssistantSwordProps {
    swordIsGlowing: boolean;
}

export const HomeAssistantSword : FC<HomeAssistantSwordProps> = ({swordIsGlowing}) => {
    useEffect(() => {
        if (swordIsGlowing) {
            fetch('http://192.168.1.140:8123/api/webhook/sword_on', 
                {method: 'POST'}
            );
        }
        else{
            fetch('http://192.168.1.140:8123/api/webhook/sword_off', 
                {method: 'POST'}
            );
        }
    }, [swordIsGlowing]);

    return (<div>
        {swordIsGlowing}
    </div>)
};