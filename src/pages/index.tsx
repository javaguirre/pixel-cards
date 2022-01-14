import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useStyletron } from 'baseui'

import CardList from '../components/cardlist'
import CardCreate from '../components/cardcreate'
import EthersClient from '../services/ethersclient'
import CardService from '../services/cardservice'
import { Card } from '../interfaces'

const Home = () => {
  const [css, theme] = useStyletron();
  const [cards, setCards] = useState([])
  const [currentAccount, setCurrentAccount] = useState('')

  useEffect(() => {
    const ethersClient = new EthersClient(window.ethereum)

    ethersClient.provider.send("eth_requestAccounts", []).then(() => {
      const signer = ethersClient.provider.getSigner();
      return signer.getAddress()
    }).then(address => setCurrentAccount(address));
  }, [currentAccount]);

  useEffect(() => {
    const ethersClient = new EthersClient(window.ethereum)

    setTimeout(() => {
      ethersClient.contract.getCardsCounter().then(counter => {
        const cardPromises = [...Array(counter.toNumber()).keys()].map(
          index => ethersClient.contract.cards(index))

        Promise.all(cardPromises).then(cardResult => {
          return cardResult.map(
            cardFromSmartContract => CardService.transformToCard(cardFromSmartContract)
          )
        }).then(currentCards => cards.length !== currentCards.length ?
                setCards(currentCards) : '')
      }).catch(error => console.log(error))
    }, 2000)
  }, [cards])

  const handleCreateCard = (cardData) => {
    const ethersClient = new EthersClient(window.ethereum)
    const signer = ethersClient.contract.connect(ethersClient.provider.getSigner())
    signer.generateCard(cardData.name, 'description', cardData.price).then(
        () => setCards([])  // TODO We can't get only one now, so we trigger reload
    )
  }

  const handleBuy = (card: Card) => {
    const ethersClient = new EthersClient(window.ethereum)
    const signer = ethersClient.contract.connect(ethersClient.provider.getSigner())
    signer.buyCard(card.id, {from: currentAccount, value: card.price}).then(
        () => setCards([])  // TODO We can't get only one now, so we trigger reload
    )
  }

  return (
    <div>
      <Head>
        <title>Pixel Cards</title>
        <meta name="description" content="Pixel Cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Pixel Cards
        </h1>

        <div>
          <CardCreate handleCreateCard={handleCreateCard} />
        </div>

        <p className={css({color: theme.colors.accent600})}>{currentAccount}</p>

        <div>
          <CardList cards={cards} handleBuy={handleBuy} />
        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export default Home
