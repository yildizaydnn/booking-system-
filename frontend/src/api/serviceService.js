import client from './client';

const serviceService = {
  getByBusiness(businessId) {
    return client.get(`/businesses/${businessId}/services`);
  },

  getById(businessId, serviceId) {
    return client.get(`/businesses/${businessId}/services/${serviceId}`);
  },

  create(businessId, data) {
    return client.post(`/businesses/${businessId}/services`, data);
  },

  update(businessId, serviceId, data) {
    return client.put(`/businesses/${businessId}/services/${serviceId}`, data);
  },

  delete(businessId, serviceId) {
    return client.delete(`/businesses/${businessId}/services/${serviceId}`);
  },
};

export default serviceService;
