import { Box, Button, Card, CardFooter, Flex, Heading, Image, Skeleton, Text } from '@chakra-ui/react';
import { useApiUrl, useCustom } from '@refinedev/core'
import { Pokemon, Type } from '../../interfaces/pokemonData';
import { colours } from '../../utils/pokemonTypeColors';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PokemonList = () => {
  const apiUrl = useApiUrl();
  const navigate = useNavigate();
  const limit = 21;
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isFetching } = useCustom<Pokemon[]>({
    url: `${apiUrl}/pokemon?offset=${offset}&limit=${limit}`,
    method: 'get',
  });

  const handlePageChange = (offset: number) => {
    setOffset(offset);
  };

  const handlePokemonDetails = (id: string) => {
    navigate(`show/${id}`);
  }
  return (
    <Box>
      <Flex flexWrap='wrap' justifyContent='center'>
        {isLoading || isFetching ? (
          Array.from({ length: 21 }).map((_, index) => (
            <Skeleton
              key={index}
              height="48"
              width="30%"
              margin="1.5"
              borderRadius="2xl"
            />
          ))
        )
          :
          data?.data.map((value: Pokemon, index) => (
            <Card
              onClick={() => handlePokemonDetails(value.name)} cursor="pointer"
              key={index} flexBasis='30%' height='48' margin='1.5' flexDirection='row-reverse' bgColor={colours[value.types[0].type.name]} borderRadius='2xl' _hover={{ bgGradient: 'linear(45deg, blackAlpha.300, transparent)', top: '-0.5rem', transform: 'scale(1.08)', zIndex: '99', transition: 'linear', transitionDuration: '0.5s', boxShadow: `0px 0px 40px 0px ${colours[value.types[0].type.name]}` }}>
              <Box>
                <Text fontSize='2xl' textColor='whiteAlpha.500' textAlign='end' marginX='5' paddingTop='4' >#{value.id}</Text>
                <Image alignSelf='center' width='full' borderRadius='2xl' marginRight='16' marginTop='-6' src={value.sprites.front_default} />
              </Box>
              <CardFooter marginRight='auto' flexDirection='column'>
                <Heading size='lg' textTransform='capitalize' margin='2' textColor='whiteAlpha.800'>
                  {value.name}
                </Heading>
                {value?.types.map((type: Type, index) => (
                  <Text marginLeft='1' width='max-content' paddingX='3' paddingY='1' margin='1' borderRadius='lg' textTransform='capitalize' bgColor='whiteAlpha.600' fontWeight='bold' textColor={colours[type.type.name]} key={index}>{type.type.name}</Text>
                ))}
              </CardFooter>
            </Card>
          ))}
      </Flex>
      <Flex margin='10' justifyContent='space-around'>
        <Button
          onClick={() => handlePageChange(offset - 21)}
          isDisabled={offset === 0}
        >
          Previous Page
        </Button>
        <Button
          onClick={() => handlePageChange(offset + 21)}
          isDisabled={offset === 1281}
        >
          Next Page
        </Button>
      </Flex>
    </Box>
  )
}