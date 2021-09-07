# useStateHandler
Class based hook. bring the value of class based definitions ( including this.setState ) and hooks 

## How to use


```jsx

import React, { FunctionComponent, useState } from 'react';
import { Input, Modal } from 'epysa-bulma';
import { ModalState } from './modalReducer';
import { ICertificado } from './interfaces';
import { StateHandler, useStateHandler } from './handler';


class CerH extends StateHandler<ICertificado> {

  public setValue( name: string, val : any ){
    this.setState (  {...this.state, ...{ [name] : val } }  )
  }


}

interface ModalProps {
  modalState              : ModalState;
  toggler                 : () => void;
}

const ModalCert: FunctionComponent<ModalProps> 
  = ({ modalState, toggler}) => {

    const [ certificado, handler ] = useStateHandler( CerH, {} );



    return (
      <Modal modalName="#mcert" toggleModal={toggler} closeButton={true}>
        <div className="box">
          <h3 className="title is-3">Nuevo Certificado</h3>

          <form autoComplete="off">

            <Input
              type='text'
              placeholder="ej: Jhon"
              value={certificado.dest_nombre}
              name="dest_nombre"
              onChange={ e => handler.setValue( e.target.name, e.target.value )  }
            />

          </form>

        </div> 
      </Modal>
    );

  };



```

