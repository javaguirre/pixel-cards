import { Card } from '../interfaces'

type Props = {
  cards: Card[]
}

function CardList({ cards }: Props) {
  return (
    <ul>
      {cards.map(card => (
        <li key={card.id}>{card.id} {card.name}</li>
      ))}
    </ul>
  )
}

export default CardList
