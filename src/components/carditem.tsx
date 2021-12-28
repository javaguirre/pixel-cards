import { Card } from '../interfaces'
import {
  Card as CardStyle,
  StyledBody,
  StyledAction
} from "baseui/card";
import { Button } from "baseui/button";

type Props = {
  card: Card,
  handleBuy: (card: Card) => void
}

function CardItem({ card, handleBuy }: Props) {
  const avatarUrl = `https://avatars.dicebear.com/api/human/${card.dna}.svg`

  return (
    <CardStyle
    overrides={{Root: {style: {width: '328px'}}}}
    headerImage={avatarUrl}
    title={card.name}
    >
    <StyledBody>
      {card.id} {card.name} {card.price}
    </StyledBody>
    <StyledAction>
      <Button
        overrides={{BaseButton: {style: {width: '100%'}}}}
        onClick={() => handleBuy(card)}
        disabled={Number(card.buyer) ? true : false}>
        Buy for {card.price} ETH
      </Button>
    </StyledAction>
  </CardStyle>
  )
}

export default CardItem
