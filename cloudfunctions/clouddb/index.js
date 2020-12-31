'use strict'
const cloudbase = require('@cloudbase/node-sdk')

const app = cloudbase.init({ env: 'aiu-mycompany-1uzhz' }) // 云环境ID

var db = app.database()

exports.main = async (event, context) => {
	let orderKey = '_id'
	let orderValue = 'asc'
	const {
		method,
		dbName,
		where,
		order,
		pageNum,
		pageSize,
		filter,
		formData,
		id,
	} = event

	// 排序
	if (order) {
		orderKey = order[0]
		orderValue = order[1] ? order[1] : 'asc'
	}
	// 排除字段
	let field = {}
	if (filter) {
		filter.forEach((v) => {
			field[v] = false
		})
	}

	let data, total, limit, skip
	const collection = db.collection(dbName)

	if (pageSize && pageNum) {
		limit = parseInt(pageSize)
		skip = parseInt(pageSize) * (parseInt(pageNum) - 1)
	}

	async function get() {
		total = await collection.where(where ? where : {}).count()
		data = await collection
			.where(where ? where : {})
			.orderBy(orderKey, orderValue)
			.limit(limit ? limit : 60)
			.skip(skip ? skip : 0)
			.field(field)
			.get()
	}
	async function add() {
		formData.createTime = new db.serverDate()
		formData.updateTime = new db.serverDate()
		data = await collection.add(formData)
	}
	async function update() {
		formData.updateTime = new db.serverDate()
		data = await collection.doc(id).update(formData)
	}
	async function remove() {
		data = await collection.doc(id).remove()
	}

	switch (method) {
		case 'get':
			await get()
			return {
				data: data.data,
				total: total.total,
				pageNum,
				pageSize,
				field,
			}
			break
		case 'add':
			await add()
			return data
			break
		case 'update':
			await update()
			return data
			break
		case 'delete':
			await remove()
			return data
			break
		default:
			return total
	}
}
