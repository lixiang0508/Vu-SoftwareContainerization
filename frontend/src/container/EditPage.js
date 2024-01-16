import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom'
import { Table, Button, ConfigProvider, theme, Space, Input, InputNumber } from 'antd';
function EditPage() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [comment, setComment] = useState("");
    const { id } = useParams()
    const nav = useNavigate()
    let onUpdateButtonClick = () => {
        fetch("/api/product", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: parseInt(id),
                name: name,
                price: price,
                comment: comment,
            })
        }).then(async response => {
            console.log(await response.text())
            if (response.ok) {
                nav("/")
            }
        })
    }

    return (
        <div style={{ width: "100%" }}>
            <div style={{
                width: "80%",
                margin: "0 auto",
                height: "50px",
                padding: "10px",
                border: "1px solid",
                fontSize: 25,
                textAlign: "center"
            }}>
                TEST EXAMPLE
            </div>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        // Seed Token，影响范围大
                        colorText: "lightgreen",
                        Table: {
                            borderColor: 'lightgreen',
                            borderRadius: 0,
                            headerBg: "black",
                            footerBg: "black",
                        }
                    },

                }}
            >
                <div style={{ height: "20px" }}></div>

                <div style={{
                    width: "60%",
                    margin: "0 auto",
                }}>
                    ID: <br />
                    <InputNumber disabled value={id} style={{ width: "100%" }} />
                    <br />
                    <br />
                    Name: <br />
                    <Input onChange={(e) => { setName(e.target.value) }} placeholder="New Name" style={{ width: "100%" }} />
                    <br />
                    <br />
                    Price: <br />
                    <InputNumber placeholder="New Price" style={{ width: "100%" }} onChange={(e) => { if (e) { setPrice(e) } }} />
                    <br />
                    <br />

                    Comment:<br />
                    <Input placeholder="New Comment" style={{ width: "100%" }} onChange={(e) => { setComment(e.target.value) }} />
                    <br />
                    <br />

                    <Button style={{ margin: "0 auto", display: "block" }} onClick={() => onUpdateButtonClick()}>EDIT</Button>
                </div>

            </ConfigProvider>
        </div>
    )
}
export default EditPage