//@ts-ignore
import * as React from 'react';

import { Spin } from 'antd';

export default function Loading() {
    return (
        <div className={"SpinnerClassName"}>
            <Spin 
                tip="Loading..."
                size="large"
                className={"DENk"}
            />
        </div>
    )
}
