/*************************************************************************************
 * Product: ADempiere gRPC Point Of Sales Client                                     *
 * Copyright (C) 2012-2020 E.R.P. Consultores y Asociados, C.A.                      *
 * Contributor(s): Yamel Senih ysenih@erpya.com                                      *
 * This program is free software: you can redistribute it and/or modify              *
 * it under the terms of the GNU General Public License as published by              *
 * the Free Software Foundation, either version 3 of the License, or                 *
 * (at your option) any later version.                                               *
 * This program is distributed in the hope that it will be useful,                   *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                    *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                     *
 * GNU General Public License for more details.                                      *
 * You should have received a copy of the GNU General Public License                 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.            *
 ************************************************************************************/

class PointOfSales {

  /**
   * Constructor, No authentication required
   * @param {string} host
   * @param {string} sessionUuid
   * @param {string} organizationUuid
   * @param {string} warehouseUuid
   * @param {string} language Languaje i18n
   */
  constructor({
    host,
    sessionUuid,
    organizationUuid,
    warehouseUuid,
    language = 'en_US',
  }) {
    this.sessionUuid = sessionUuid;
    this.host = host;
    this.language = language;
    this.organizationUuid = organizationUuid;
    this.warehouseUuid = warehouseUuid;
  }

  /**
   * Load gRPC Connection
   * @return {object} requestService Return request for get data
   */
  getService() {
    const grpc_promise = require('grpc-promise');
    const { StorePromiseClient } = require('./src/grpc/proto/point_of_sales_grpc_web_pb.js');
    const requestService = new StorePromiseClient(this.host);
    grpc_promise.promisifyAll(requestService);
    //  Return request for get data
    return requestService;
  }

  getClientRequest() {
    const { ClientRequest } = require('@adempiere/grpc-core-client/src/grpc/proto/core_functionality_pb.js');
    const clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    clientRequest.setOrganizationuuid(this.organizationUuid);
    clientRequest.setWarehouseuuid(this.warehouseUuid);
    return clientRequest;
  }

  getSystemCoreInstance() {
    const SystemCore = require('@adempiere/grpc-core-client');
    return new SystemCore({
      host: this.host,
      sessionUuid: this.sessionUuid,
      organizationUuid: this.organizationUuid,
      warehouseUuid: this.warehouseUuid,
      language: this.language
    });
  }

  /**
   * Get Point Of Sales Definition
   */
  getPointOfSales({
    pointOfSalesUuid,
    isConvert = true
  }) {
    const { PointOfSalesRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new PointOfSalesRequest();

    request.setClientrequest(this.getClientRequest());
    request.setPointofsalesuuid(pointOfSalesUuid);
    //
    return this.getService().getPointOfSales(request)
      .then(pontOfSalesResponse => {
        if (isConvert) {
          const { convertPointOfSalesFromGRPC } = require('./src/convertUtils.js');
          return convertPointOfSalesFromGRPC(posItem);
        }
        return pontOfSalesResponse;
      });
  }

  /**
   * Get List Point Of Sales
   */
  listPointOfSales({
    userUuid,
    pageSize,
    pageToken,
    isConvert = true
  }) {
    const { ListPointOfSalesRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new ListPointOfSalesRequest();

    request.setClientrequest(this.getClientRequest());
    request.setUseruuid(userUuid);
    request.setPageSize(pageSize);
    request.setPageToken(pageToken);
    //
    return this.getService().listPointOfSales(request)
      .then(pontOfSalesResponse => {
        if (isConvert) {
          const { convertPointOfSalesFromGRPC } = require('./src/convertUtils.js');

          return {
            recordCount: pontOfSalesResponse.getRecordcount(),
            sellingPointsList: pontOfSalesResponse.getSellingpointsList().map(posItem => {
              return convertPointOfSalesFromGRPC(posItem);
            }),
            nextPageToken: pontOfSalesResponse.getNextPageToken()
          };
        }
        return pontOfSalesResponse;
      });
  }

  /**
   * Get List Orders from POS UUID
   */
  listOrders({
    posUuid,
    pageSize,
    pageToken,
    isConvert = true
  }) {
    const { ListOrdersRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new ListOrdersRequest();

    request.setClientrequest(this.getClientRequest());
    request.setPosuuid(posUuid);
    request.setPageSize(pageSize);
    request.setPageToken(pageToken);
    //
    return this.getService().listOrders(request)
      .then(response => {
        if (isConvert) {
          const { convertOrderFromGRPC } = require('./src/convertUtils.js');

          return {
            recordCount: response.getRecordcount(),
            ordersList: response.getOrdersList().map(order => {
              return convertOrderFromGRPC(order);
            }),
            nextPageToken: response.getNextPageToken()
          };
        }
        return response;
      });
  }

  /**
   * Get List Order Lines from Order UUID
   */
  listOrderLines({
    orderUuid,
    pageSize,
    pageToken,
    isConvert = true
  }) {
    const { ListOrderLinesRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new ListOrderLinesRequest();

    request.setClientrequest(this.getClientRequest());
    request.setOrderuuid(orderUuid);
    request.setPageSize(pageSize);
    request.setPageToken(pageToken);
    //
    return this.getService().listOrderLines(request)
      .then(response => {
        if (isConvert) {
          const { convertOrderLineFromGRPC } = require('./src/convertUtils.js');

          return {
            recordCount: response.getRecordcount(),
            orderLineList: response.getOrderlinesList().map(orderLine => {
              return convertOrderLineFromGRPC(orderLine);
            }),
            nextPageToken: response.getNextPageToken()
          };
        }
        return response;
      });
  }

  /**
   * Get Product Price
   */
  getProductPrice({
    searchValue,
    upc,
    value,
    name,
    priceListUuid,
    businessPartnerUuid,
    warehouseUuid,
    validFrom,
    isConvert = true
  }) {
    const { GetProductPriceRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new GetProductPriceRequest();

    request.setClientrequest(this.getClientRequest());
    request.setSearchvalue(searchValue);
    request.setUpc(upc);
    request.setValue(value);
    request.setName(name);
    request.setPricelistuuid(priceListUuid);
    request.setBusinesspartneruuid(businessPartnerUuid);
    request.setWarehouseuuid(warehouseUuid);
    request.setValidfrom(validFrom);
    //
    return this.getService().getProductPrice(request)
      .then(productPriceResponse => {
        if (isConvert) {
          const { convertProductPriceFromGRPC } = require('@adempiere/grpc-core-client/src/convertCoreFunctionality.js');
          return convertProductPriceFromGRPC(productPriceResponse);
        }
        return productPriceResponse;
      });
  }

  createOrder({
    posUuid,
    customerUuid,
    documentTypeUuid,
    isConvert = true
  }) {
    const { CreateOrderRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new CreateOrderRequest();

    request.setClientrequest(this.getClientRequest());
    request.setPosuuid(posUuid);
    request.setCustomeruuid(customerUuid);
    request.setDocumenttypeuuid(documentTypeUuid);

    return this.getService().createOrder(request)
      .then(createOrderResponse => {
        if (isConvert) {
          const { convertOrderFromGRPC } = require('./src/convertUtils.js');
          return convertOrderFromGRPC(createOrderResponse);
        }
        return createOrderResponse;
      });
  }

  getOrder({
    orderUuid,
    isConvert = true
  }) {
    const { GetOrderRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new GetOrderRequest();

    request.setClientrequest(this.getClientRequest());
    request.setOrderuuid(orderUuid);
    return this.getService().getOrder(request)
      .then(order => {
        if (isConvert) {
          const { convertOrderFromGRPC } = require('./src/convertUtils.js');
          return convertOrderFromGRPC(order);
        }
        return order;
      });
  }

  deleteOrder({
    orderUuid
  }) {
    const { DeleteOrderRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new DeleteOrderRequest();

    request.setClientrequest(this.getClientRequest());
    request.setOrderuuid(orderUuid);

    return this.getService().deleteOrder(request);
  }

  createOrderLine({
    orderUuid,
    productUuid,
    chargeUuid,
    description,
    quantity,
    price,
    discountRate,
    warehouseUuid,
    isConvert = true
  }) {
    const { CreateOrderLineRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new CreateOrderLineRequest();

    request.setClientrequest(this.getClientRequest());
    request.setOrderuuid(orderUuid);
    request.setProductuuid(productUuid);
    request.setChargeuuid(chargeUuid);
    request.setDescription(description);
    request.setQuantity(quantity);
    request.setPrice(price);
    request.setDiscountrate(discountRate);
    request.setWarehouseuuid(warehouseUuid);

    return this.getService().createOrderLine(request)
      .then(createOrderLineResponse => {
        if (isConvert) {
          const { convertOrderLineFromGRPC } = require('./src/convertUtils.js');
          return convertOrderLineFromGRPC(createOrderLineResponse);
        }
        return createOrderLineResponse;
      });
  }

  deleteOrderLine({
    orderLineUuid
  }) {
    const { DeleteOrderLineRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new DeleteOrderLineRequest();

    request.setClientrequest(this.getClientRequest());
    request.setOrderlineuuid(orderLineUuid);

    return this.getService().deleteOrderLine(request);
  }

  updateOrderLine({
    orderLineUuid,
    description,
    quantity,
    price,
    discountRate,
    isConvert = true
  }) {
    const { UpdateOrderLineRequest } = require('./src/grpc/proto/point_of_sales_pb.js');
    const request = new UpdateOrderLineRequest();

    request.setClientrequest(this.getClientRequest());
    request.setOrderlineuuid(orderLineUuid);
    request.setDescription(description);
    request.setQuantity(quantity);
    request.setPrice(price);
    request.setDiscountrate(discountRate);

    return this.getService().updateOrderLine(request)
      .then(updateOrderLineResponse => {
        if (isConvert) {
          const { convertOrderLineFromGRPC } = require('./src/convertUtils.js');
          return convertOrderLineFromGRPC(updateOrderLineResponse);
        }
        return updateOrderLineResponse;
      });
  }

}

module.exports = PointOfSales;
