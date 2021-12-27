import { Card } from '../interfaces'

type Props = {
  card: Card
}

function CardItem({ card }: Props) {
  const avatarUrl = `https://avatars.dicebear.com/api/human/${card.dna}.svg`
  console.log(card.name)
  console.log(card.dna)

  return (
    <div key={card.id}>
        <p>{card.id} {card.name} {card.price}</p>
        <img src={avatarUrl} />
    </div>
  )
}

export default CardItem
