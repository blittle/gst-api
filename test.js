import { addUpdateContentAggregate } from './src/db/content-aggregate';


export default function() {
	addUpdateContentAggregate({
		user_id: '2bd1553b-70d7-4bb9-8327-4cb9f93e0ee9',
		type: 'SCRIPTURE',
		l1: 'dc-testament',
		l2: 'dc',
		l3: '23',
		l4: '',
		time: 200000
	})
}
