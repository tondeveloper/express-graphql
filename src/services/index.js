import { default as DogService } from './dog'
import { default as CatService } from './cat'

const Services = ({ mongo }) => {
  const svc = {}
  svc.Dog = DogService(mongo.getConnection('mongo1'))
  svc.Cat = CatService(mongo.getConnection('mongo2'))
  return svc
}

export default Services
