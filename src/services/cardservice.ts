import { transform } from "typescript"

import { Card } from '../interfaces'

class CardService {
    static transformToCard(cardFromSmartContract: Array<any>) : Card {
        return {
            id: cardFromSmartContract[0].toNumber(),
            name: cardFromSmartContract[1],
            description: cardFromSmartContract[2],
            dna: cardFromSmartContract[3].toString(),
            price: cardFromSmartContract[4].toNumber(),
            seller: cardFromSmartContract[5],
            buyer: cardFromSmartContract[6]
        }
    }
}

export default CardService
