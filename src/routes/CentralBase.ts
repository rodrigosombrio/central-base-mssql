import { Controller, Get } from 'routing-controllers';

@Controller()
export class CentralBase {
	@Get('/all')
	public getAll () {
		return { message: 'This action returns all users' };
	}
}
