import React, { useState, useEffect } from 'react';
import { Table, Button, ConfigProvider, theme, Space, Input, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom'
function MainPage() {
    const nav = useNavigate()
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [comment, setComment] = useState("");
    useEffect(() => {
        fetch("/api/product").then(response => response.json()).then(
            json => {
                setData(json)
            }
        )
    }, [])
    let onDeleteButtonClick = (obj) => {
        console.log(obj)
        fetch("api/product", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        }).then(response => {
            if (response.ok) {
                window.location.reload()
            }
        })
    }
    let onEditButtonClick = (obj) => { nav("/edit/" + obj.id) }
    let onCreateButtonClick = () => {
        fetch("api/product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                price: price,
                comment: comment,
            })
        }).then(response => {
            if (response.ok) {
                window.location.reload()
            }
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => onEditButtonClick(record)}>&nbsp;&nbsp;Edit&nbsp;&nbsp;</Button>
                    <Button danger onClick={() => onDeleteButtonClick(record)}>Delete</Button>
                </Space>
            ),
        },
    ]

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
                    width: "80%",
                    margin: "0 auto",
                    textAlign: "center"
                }}>
                    <Space align='center' >
                        Name: <Input onChange={(e) => { setName(e.target.value) }} placeholder="Name" />
                        Price: <InputNumber placeholder="Price" onChange={(e) => { if (e) { setPrice(e) } }} />
                        Comment:<Input placeholder="Comment" onChange={(e) => { setComment(e.target.value) }} />
                        <Button onClick={() => onCreateButtonClick()}>&nbsp;&nbsp;Create&nbsp;&nbsp;</Button>

                    </Space>

                </div>
                <Table columns={columns} dataSource={data} style={{
                    width: "80%",
                    margin: "0 auto"
                }} local={{ emptyText: 'Abc' }} rowKey="id" />
            </ConfigProvider>
        </div>
    )
}
export default MainPage