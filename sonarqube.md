issues from sonarqube and solution

1.'children' is missing in props validation - react components receives props but there will no validation for that.so props can receive any datatype accidentally. like button can recieve full width as hello instead of boolean values. SOLUTION: adding validations by using proptypes for defining each props

2.Ensure that tainted data is validated before being used to construct a client-side request URL. - attackers can bypass frontend completely and directly hit backend APIs by sending instead of ids they send text,non integer numbers and malformed endpoints.SOLUTION:adding validations like only numbers are allowed,only positive integers and safe integers and normalize the ids - 5 -> "5" and "6"->"6"


3.Ensure that tainted data is sanitized before being written to browser storage. - Backend responses are external data, so frontend should not blindly trust them.
Someone could send:

role = "ADMIN"
role = "<script>"
role = 123
email = "../../../abc"
email = "hello"

It stores directly to the browser without any validations.so we sanitize them


