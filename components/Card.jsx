import React from 'react'
import styles from '../styles/card.module.css'
export default function Card({titulo,numero,color}) {
  
    return (
    <div className={styles.container} style={{color}} > 
            <h3>{titulo}:{numero}</h3>
    </div>
  )

}
