import React from 'react';

import { withRouter } from 'react-router-dom';

/** */
class CustomFooterLeftRightItem extends React.Component {

    render() {
        const { leftItem, rightItem, page } = this.props;
        return (
            <div>
                {Boolean(page) &&
                    <div style={{ alignItems: 'flex-end' }}>
                        <div>{page}</div>
                    </div>
                }
                <div style={{ borderTopWidth: 0, bottom: 0 }}>
                    {
                        Boolean(leftItem) && Boolean(rightItem) &&
                            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    {leftItem}
                                </div>
                                <div>
                                    {rightItem}
                                </div>
                            </div>
                    }
                    {
                        Boolean(leftItem) && !Boolean(rightItem) &&
                            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
                                <div>
                                    {leftItem}
                                </div>
                            </div>
                    }

                    {
                        Boolean(rightItem) && !Boolean(leftItem) &&
                            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <div>
                                    {rightItem}
                                </div>
                            </div>
                    }
                    
                </div>
            </div>
        );
    }
}

export default withRouter(CustomFooterLeftRightItem);

