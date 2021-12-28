import {useStyletron} from 'baseui';
import {Grid, Cell} from 'baseui/layout-grid';

import { Card } from '../interfaces'
import CardItem from './carditem'

type Props = {
  cards: Card[]
}

function CardList({ cards }: Props) {
  return (
     <Outer>
      <Grid>
        {cards.map(card => (
          <Cell span={[1, 2, 3]}>
            <Inner>
              <CardItem key={card.id} card={card} />
            </Inner>
          </Cell>
        ))}
      </Grid>
    </Outer>
 )
}


const Outer: React.FunctionComponent<{}> = ({children}) => {
  return (
    <div>
      {children}
    </div>
  );
};
const Inner: React.FunctionComponent<{}> = ({children}) => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.accent700,
        padding: '.25rem',
      })}
    >
      {children}
    </div>
  );
};

export default CardList
