
IMAGE=novaline/nodejs-hello-world


if [ $1 ]
then 
  IMAGE=$1
fi

PACKAGE_VERSION=$(cat ./package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "image name: $IMAGE"
echo "image tag: $PACKAGE_VERSION"

docker build -t $IMAGE:$PACKAGE_VERSION . \
  && docker push $IMAGE:$PACKAGE_VERSION