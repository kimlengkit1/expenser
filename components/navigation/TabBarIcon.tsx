// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type ComponentProps } from 'react';

//Define types for supported icon families
type IoniconsProps = ComponentProps<typeof Ionicons>;
type MaterialIconsProps = ComponentProps<typeof MaterialIcons>;
type MaterialCommunityIconsProps = ComponentProps<typeof MaterialCommunityIcons>;

// Consolidate the props for TabBarIcon
type TabBarIconProps =
  | (IoniconsProps & { iconType: 'Ionicons' })
  | (MaterialIconsProps & { iconType: 'MaterialIcons' })
  | (MaterialCommunityIconsProps & { iconType: 'MaterialCommunityIcons' });

export function TabBarIcon({ style, iconType, name, ...rest }: TabBarIconProps) {
  // Icon rendering logic
  switch (iconType) {
    case 'Ionicons':
      return <Ionicons name={name} size={28} color="black" />
      //<Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
    case 'MaterialIcons':
      return <MaterialIcons name={name} size={28} color="black" />
      //<MaterialIcons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name} size={28} color="black" />
      //<MaterialCommunityIcons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
    default:
      return <Ionicons name="home" size={28} color="black" />
      //<Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
  }
}


// export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
//   return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
// }