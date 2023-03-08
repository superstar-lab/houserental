import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Container, Header, Footer, Content, List } from 'rsuite';
import { FaUmbrellaBeach, FaHome, FaBars } from 'react-icons/fa';
import welcome from './../../assets/images/welcome.png';

import './welcome-page.css';
import theme from '../../theme/theme';
import LocalStorageHelper from '../../helper/local.storage.helper';

class WelComePage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            openMenu: false,
            user: {},
            isLogin: false
        }
        this.secUser = null;
    }

    componentDidMount() {
        console.log(this.props);
        const user = LocalStorageHelper.getCurrentUser();
		if (user) {
			this.setState({
				user: user
				, isLogin: true
            });
        }
    }

    onLogout() {
        LocalStorageHelper.setCurrentUser(null);
		this.setState({isLogin: false});
	}

    navigateTo(path) {
		this.props.history.push(path);
	}

    render() {
        return(
            <Container className={'welcome-page'} style={{backgroundColor: '#010D3C', minHeight: '100vh'}}>
                <Header style={{height: 60}}>
                    <div style={{display: 'flex', flexDirection: 'row', height: 60}}>
                        <div className={'rent-type'}>
                            <div className={'item'} onClick={() => {this.navigateTo('/propertymaps')}}>
                                <span><FaUmbrellaBeach size={30}/>Short term</span>
                            </div>
                            <div className={'item'} onClick={() => {this.navigateTo('/propertymaps')}}>
                                <span><FaHome size={30}/>Long term</span>
                            </div>
                        </div>
                        <div style={{position: 'absolute', right: 10, top: 10}}>
                            <button 
                                onBlur={() => {this.setState({openMenu: false})}}
                                onFocus={() => {this.setState({openMenu: true})}} 
                                style={{color: theme.FOGGY, backgroundColor: '#FFFFFF', fontSize: 20, borderRadius: 20, width: 40, height: 40, textAlign: 'center', paddingTop: 2}}>
                                <FaBars/>
                            </button>
                            {
                                this.state.openMenu ? 
                                <div style={{display: 'flex', flexDirection: 'column', position: "absolute", minWidth: 150 , top: 45, right: 0, backgroundColor: '#F6F6F6', borderRadius: 10, border: '1px solid #808080', zIndex: 999}}>
                                    {/* <text onClick={() => {this.navigateTo("/login/1")}}>Register</text>
                                    <text onClick={() => {this.navigateTo("/login/0")}}>Log in</text> */}
                                    {
                                        !this.state.isLogin ?
                                        <List size="sm" hover bordered>
                                            <div onMouseDown={() => {this.navigateTo("/login/1")}}>
                                                <List.Item>Register</List.Item>
                                            </div>
                                            <div onMouseDown={() => {this.navigateTo("/login/0")}}>
                                                <List.Item>Log in</List.Item>
                                            </div>
                                        </List> 
                                        :
                                        <List size="sm" hover bordered>
                                            <List.Item>
                                                <strong>{this.state.user.desc}</strong>
                                            </List.Item>
                                            <div onMouseDown={() => {this.onLogout()}}>
                                                <List.Item>
                                                    Log out
                                                </List.Item>
                                            </div>
                                        </List>
                                    }
                                </div>
                                : null
                            }
                        </div>
                    </div>
                </Header>
                <Content>
                    <div className={'fade-in'} style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'inline-flex', flexDirection: 'column', marginTop: '12vh', }}>
                            <h1 style={{color: '#EFFFFD', fontSize: 80, textAlign: 'center'}}>hello</h1>
                            <img src={welcome} alt="welcome" style={{width: 300}}/>
                            <Button style={{marginTop: 40}} onClick={() => {this.navigateTo('/propertymaps')}}>Start the experience</Button>
                        </div>
                    </div>
                </Content>
                <Footer>
                    <div style={{display: 'flex', justifyContent: 'center', color: '#FFFFFF'}}>
                        {'© 2020 '} <a href="#">MOIEN</a><span className="js-now-year">, Inc.</span>
                    </div>
                </Footer>
            </Container>
        );
    }

}

export default withRouter(WelComePage);