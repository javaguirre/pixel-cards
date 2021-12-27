import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import CardList from '../components/cardlist';
import CardCreate from '../components/cardcreate';
import EthersClient from '../services/ethersclient';
import CardService from '../services/cardservice';

const Home = () => {
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
  }, [cards])

  const handleCreateCard = (cardData) => {
    const ethersClient = new EthersClient(window.ethereum)
    const signer = ethersClient.contract.connect(ethersClient.provider.getSigner())
    signer.generateCard(cardData.name, 'description', cardData.price).then(
        () => setCards([])  // TODO We can't get only one now, so we trigger reload
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pixel Cards</title>
        <meta name="description" content="Pixel Cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pixel Cards
        </h1>

        <div>
          <CardCreate handleCreateCard={handleCreateCard} />
        </div>

        <p>{currentAccount}</p>

        <div className={styles.description}>
          <CardList cards={cards} />
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Home
