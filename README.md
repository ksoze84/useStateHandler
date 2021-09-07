# useStateHandler
Class based hook. bring the value of hooks and class based definitions together ( including this.setState ) 

## How to use


```jsx

...
import { StateHandler, useStateHandler } from './handler';

class CertH extends StateHandler<ICert> {

  public setValue( name: string, val : any ){
    this.setState (  {...this.state, ...{ [name] : val } }  )
  }

}

const ModalCert: FunctionComponent<ModalProps> 
  = ({ modalProps, toggler}) => {

    const [ cert, handler ] = useStateHandler( CertH, {} );

    return (
        <div className="box">
          <h3 className="title">New Cert</h3>

          <form autoComplete="off">

            <Input
              type='text'
              placeholder="ej: Jhon"
              value={cert.name}
              name="name"
              onChange={ e => handler.setValue( e.target.name, e.target.value )  }
            />
            
            <Input
              type='text'
              placeholder="ej: Jhon@mail.com"
              value={cert.mail}
              name="mail"
              onChange={ e => handler.setValue( e.target.name, e.target.value )  }
            />

          </form>

        </div> 
    );

  };



```

