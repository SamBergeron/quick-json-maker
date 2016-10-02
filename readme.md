## quick-json-maker
### A Fast way to write JSON files for testing

Uses an easy syntax so that you can write json by hand without the hassle of handlebars, commas or quotes

Currently in the works for a live demo....

### Example

> key1: string
> key2: String
> key3: true
> key4 : 12345
> key5: 123.241
> key7 :
> 	subKey : value
> 	subKey1 : value1
> 	subKey 2: value2
> 	subKey3: value3
> key6 : 123foo

would return 

> {
>   "key1": "string",
>   "key2": "String",
>   "key3": null,
>   "key4": 12345,
>   "key5": 123.241,
>   "key7": {
>     "subKey": "value",
>     "subKey1": "value1",
>     "subKey 2": "value2",
>     "subKey3": "value3"
>   },
>   "key6": "123foo"
> }