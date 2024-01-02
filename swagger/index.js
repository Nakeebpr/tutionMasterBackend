



/**
 * @swagger
 *  components:
 *      schemas:
 *          photos:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedAt:
 *                      type: string
 *                  imageTitle:
 *                      type: string
 *                  image:
 *                      type: object
 *                      properties:
 *                          path:
 *                              type: string
 *          login:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 */





/**
 * @swagger
 * /api:
 *  get:
 *      summary: This api is used to check if get api is working correctly 1
 *      description: This api is used to check if get api is working corrctly
 *      responses:
 *          200:
 *              description: To test get method
 *          201:
 *              description: This is 201
 */


/**
 * @swagger
 * /api/getPhotos:
 *   get:
 *     summary: This API is used to get photo data
 *     description: This API is used to get photo data
 *     responses:
 *       200:
 *         description: Photo data received
 *         content:
 *           application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: "#components/schemas/photos"
 */


/**
 * @swagger
 * /api/studentInformation/{id}:
 *  get:
 *      summary: This is to get single student record
 *      description: This is to get single student record
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric id required
 *            schema:
 *                type: integer
 *      responses:
 *          200:
 *              description: Photo with param
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#components/schemas/photos"
 */

/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: To check login
 *      description: To check login
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#components/schemas/login"
 *      responses:
 *          200:
 *              description: Login successfull
 */


// below is for reference only 

/**
 * @swagger
 * /api/update:
 *  put:
 *      summary: To update data
 *      description: To update data
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#components/schemas/update"
 *      responses:
 *          200:
 *              description: Update successfull
 */