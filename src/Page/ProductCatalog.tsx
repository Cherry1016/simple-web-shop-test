import React, { useState, useEffect } from "react";
import { Accordion, Icon, Divider, Input, Button, Dimmer, Loader, Segment, Header } from "semantic-ui-react";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { CategoryType, ProductType } from "../Model";
import { ButtonWithAddBasket } from "../components";
import { formatComma } from "../utils";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

const ProductCatalog = (props: Props) => {

  const [categories, setCategories] = useState<CategoryType[]>([])
  const [products, setProducts] = useState<ProductType[]>([])
  const [activeAcc, setActiveAcc] = useState<string[]>([])
  const [searchName, setSearchName] = useState<string>("")
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false)
  const [productLoading, setProductLoading] = useState<boolean>(false)
  const [loadCategoryError, setLoadCategoryError] = useState<boolean>(false)
  const history = useHistory();

  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    if (props.match?.params?.id) {
      return getProducts()
    }
    return setProducts([])
  }, [props.match?.params?.id])

  const getProducts = () => {
    const proxyurl = "http://127.0.0.1:8080/";
    setProductLoading(true)
    fetch(proxyurl + 'https://www.bluestonethailand.co.th/uploads/1/1/8/2/118296037/products.json')
      .then((response) => {
        setProductLoading(false)
        if (response.status !== 200) {
          setProducts([])
          return;
        }
        response.json().then(function (data) {
          setProducts(data.filter((item: ProductType) => item.category === props.match?.params?.id))
        });
      }
      )
      .catch((err) => {
        setProductLoading(false)
        setProducts([])
      });
  }

  const getCategories = () => {
    const proxyurl = "http://127.0.0.1:8080/";
    setCategoryLoading(true)
    fetch(proxyurl + 'https://www.bluestonethailand.co.th/uploads/1/1/8/2/118296037/categories.json')
      .then((response) => {
        setCategoryLoading(false)
        if (response.status !== 200) {
          setCategories([])
          return;
        }
        response.json().then(function (data) {
          setCategories(data)
        });
      }
      )
      .catch((err) => {
        setCategoryLoading(false)
        setCategories([])
        setLoadCategoryError(true)
      });
  }

  const handleClickAccodion = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    let newActiveAcc = [...activeAcc]
    if (activeAcc.includes(id)) {
      newActiveAcc = newActiveAcc.filter((item) => item !== id)
    } else {
      newActiveAcc.push(id)
    }
    setActiveAcc(newActiveAcc)
  }

  const createCategories = ({ parentId }: { parentId?: string } = {}) => {
    let newCategories = categories.filter((item) => {
      if (parentId) {
        return (item.parentCategory === parentId) && (item.id !== parentId)
      }
      return item.parentCategory === item.id
    })
    return newCategories.map((item) => {
      let subItem = categories.find((cat) => cat.parentCategory === item.id)
      if (!subItem) {
        return (
          <div key={item.id} className="categories-item" onClick={() => {
            if (props.match?.params?.id !== item.id) {
              history.push(`/${item.id}`)
            }
          }}>
            <h4>{item.name}</h4>
            {item.description ? <p>{item.description}</p> : null}
          </div>
        )
      }
      return (
        <Accordion key={item.id} >
          <Accordion.Title
            active={activeAcc.includes(item.id)}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClickAccodion(e, item.id)}
          >
            {item.name}
            {subItem ? <Icon name='dropdown' /> : null}
          </Accordion.Title>
          <Accordion.Content active={activeAcc.includes(item.id)}>
            {item.description ? <p>{item.description}</p> : null}
            {createCategories({ parentId: item.id })}
          </Accordion.Content>
        </Accordion>
      )
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchName(value)
  }


  const handleGotoBasketSummary = () => {
    history.push("/basket-summary")
  }

  if (loadCategoryError) {
    return (
      <Dimmer.Dimmable>
        <Dimmer inverted active={categoryLoading}>
          <Loader />
        </Dimmer>
        <Segment className="product-catalog" placeholder basic>
          <Header as="h1" icon>
            An error occurred.
        </Header>
          <Button onClick={getCategories} circular size="massive" icon="refresh" />
        </Segment>
      </Dimmer.Dimmable>
    )
  }

  return (
    <div className="product-catalog">
      <div className={`categories-menu ${props.match?.params?.id ? "" : "no-content"}`}>
        <Dimmer.Dimmable>
          <Dimmer inverted active={categoryLoading}>
            <Loader />
          </Dimmer>
          <div className="categories-menu-header">
            <h2>Categories</h2>
          </div>
          <Divider />
          {createCategories()}
        </Dimmer.Dimmable>
      </div>
      {props.match?.params?.id && (
        <div className="product-list">
          <Dimmer.Dimmable>
            <Dimmer inverted active={productLoading}>
              <Loader inverted />
            </Dimmer>
            <div className="headline">
              <h1>Add Products</h1>
              <Button content="Baseket Summary" color="green" onClick={handleGotoBasketSummary} />
            </div>
            <br />
            <Input fluid icon="search" placeholder="Search product name" value={searchName} onChange={handleSearch} />
            <div className="product-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>
                      Name
              </th>
                    <th>
                      Price
              </th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(item => item.name.toLowerCase().includes(searchName.toLowerCase())).map((item) => {
                    return (
                      <tr key={item.id}>
                        <td className="item-name">
                          {item.name}
                        </td>
                        <td className="item-price">
                          {formatComma(parseFloat(item.price).toFixed(2))}
                        </td>
                        <td>
                          <ButtonWithAddBasket key={item.id} product={item} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Dimmer.Dimmable>
        </div>)}
    </div>
  )
}

export default (ProductCatalog)