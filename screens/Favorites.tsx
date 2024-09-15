import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { fetchContacts } from "../utility/api";
import ContactThumbnail from "../components/ContactThumbnail";
import { NavigationProp } from "@react-navigation/native";

const keyExtractor = ({ phone }: { phone: string }) => phone;

export default function FavoritesScreen({
	navigation,
}: {
	navigation: NavigationProp<any>;
}) {
	const [contacts, setContacts] = useState<
		{ avatar: string; favorite: boolean; phone: string }[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			const favorites = contacts.filter((contact) =>
				globalThis.favoriteContacts.has(contact.phone) && contact.favorite
			);
			setContacts(favorites);
		});

		if (globalThis.favoriteContacts.size === 0) {
			fetchContacts()
				.then((contacts) => {
					setContacts(contacts);
					setLoading(false);
					setError(false);
				})
				.catch((e) => {
					setLoading(false);
					setError(true);
				});
		} else {
			const favorites = contacts.filter((contact) =>
				globalThis.favoriteContacts.has(contact.phone) && contact.favorite
			);
			setContacts(favorites);
			setLoading(false);
			setError(false);
		}

		return unsubscribe;
	}, []);

	const renderFavoriteThumbnail = ({
		item,
	}: {
		item: { avatar: string; [key: string]: any };
	}) => {
		const { avatar } = item;
		return (
			<ContactThumbnail
				avatar={avatar}
				onPress={() => navigation.navigate("Profile", { contact: item })}
				name={""}
				phone={""}
				textColor={""}
			/>
		);
	};

	const favorites = contacts.filter((contact) => contact.favorite);

	return (
		<View style={styles.container}>
			{loading && (
				<ActivityIndicator
					color={"blue"}
					size={"large"}
					style={styles.loadingIndicator}
				/>
			)}
			{error && <Text>Error...</Text>}
			{!loading && !error && (
				<FlatList
					data={favorites}
					keyExtractor={keyExtractor}
					numColumns={3}
					contentContainerStyle={styles.list}
					renderItem={renderFavoriteThumbnail}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		justifyContent: "center",
		flex: 1,
	},
	list: {
		alignItems: "center",
	},
	loadingIndicator: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
