import { Card } from '../interfaces'

import CardItem from './carditem'

type Props = {
  cards: Card[]
}

function CardList({ cards }: Props) {
  return (
    <div>
      {cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  )
}

export default CardList
